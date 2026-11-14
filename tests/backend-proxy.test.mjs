import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {isIP} from 'node:net';

function harness(upstream, token = 'server-token', env = {}) {
  const cookieWrites = [];
  const calls = [];
  class NextResponse extends Response {
    cookies = { set: (...args) => cookieWrites.push(args) };
    static json(body, init) { return new NextResponse(JSON.stringify(body), {...init, headers: {'content-type':'application/json'}}); }
  }
  const exports = {};
  const source = fs.readFileSync('app/api/backend/[...segments]/route.ts','utf8');
  const code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code, { exports, Headers, Response, URL, process:{env:{BACKEND_API_URL:'http://backend.test/api/v1',NODE_ENV:'production',...env}},
    require(name) { if(name==='node:net')return {isIP};if(name==='next/headers')return {cookies:async()=>({get:()=>token?{value:token}:undefined})};if(name==='next/server')return {NextResponse};throw Error(name); },
    fetch:async(url,init)=>{calls.push({url,init});return upstream;},
  });
  return { exports,cookieWrites,calls };
}
function request(method='GET',origin='http://frontend.test',body='{}') {
  return { method, nextUrl:new URL('http://frontend.test/api/backend/example?page=2'), headers:new Headers({'origin':origin,'content-type':'application/json'}), arrayBuffer:async()=>new TextEncoder().encode(body).buffer };
}
const context=(...segments)=>({params:Promise.resolve({segments})});

test('login uses the v1 upstream and keeps the bearer token in an HttpOnly cookie',async()=>{
  const h=harness(Response.json({data:{token:'secret',user:{id:1}}}));
  const response=await h.exports.POST(request('POST'),context('auth','login'));
  assert.equal(h.calls[0].url,'http://backend.test/api/v1/auth/login?page=2');
  assert.equal((await response.json()).data.token,'http-only-cookie');
  assert.equal(h.cookieWrites[0][1],'secret');
  assert.equal(h.cookieWrites[0][2].httpOnly,true);
  assert.equal(h.cookieWrites[0][2].secure,true);
});
test('rejects writes from a different origin before forwarding',async()=>{
  const h=harness(Response.json({data:{}}));
  const response=await h.exports.POST(request('POST','http://other.test'),context('tasks'));
  assert.equal(response.status,403);assert.equal(h.calls.length,0);
});
test('forwards the cookie bearer and multipart boundary without JSON conversion',async()=>{
  const h=harness(Response.json({data:{id:3}},{status:201}));
  const req=request('POST');req.headers.set('content-type','multipart/form-data; boundary=example');
  await h.exports.POST(req,context('admin','library','resources'));
  assert.equal(h.calls[0].init.headers.get('authorization'),'Bearer server-token');
  assert.equal(h.calls[0].init.headers.get('content-type'),'multipart/form-data; boundary=example');
  assert.equal(new TextDecoder().decode(h.calls[0].init.body),'{}');
});
test('logout accepts an empty 204 response and deletes the session cookie',async()=>{
  const h=harness(new Response(null,{status:204}));
  const response=await h.exports.POST(request('POST'),context('auth','logout'));
  assert.equal(response.status,204);assert.equal(await response.text(),'');
  assert.equal(h.cookieWrites[0][2].maxAge,0);
});
test('streams library downloads with their filename and private cache headers',async()=>{
  const h=harness(new Response('%PDF-file',{headers:{'content-type':'application/pdf','content-disposition':'attachment; filename="course.pdf"'}}));
  const response=await h.exports.GET(request(),context('library','resources','4','download'));
  assert.equal(response.headers.get('content-type'),'application/pdf');
  assert.equal(response.headers.get('content-disposition'),'attachment; filename="course.pdf"');
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  assert.equal(await response.text(),'%PDF-file');
});
test('expired authenticated requests clear the session but failed login does not clear an existing session',async()=>{
  const expired=harness(Response.json({message:'Unauthenticated.'},{status:401}));
  await expired.exports.GET(request(),context('users','me'));
  assert.equal(expired.cookieWrites[0][2].maxAge,0);
  const failed=harness(Response.json({message:'Unauthenticated.'},{status:401}));
  await failed.exports.POST(request('POST'),context('auth','login'));
  assert.equal(failed.cookieWrites.length,0);
});


test('forwards only the server BFF secret and the Vercel-validated client address',async()=>{
  const secret='server-only-secret-'.repeat(3);
  const h=harness(Response.json({data:{}}),'token',{BFF_SHARED_SECRET:secret,VERCEL:'1'});
  const req=request();req.headers.set('x-bff-secret','spoofed');req.headers.set('x-bff-client-ip','192.0.2.99');req.headers.set('x-forwarded-for','203.0.113.8');
  const response=await h.exports.GET(req,context('tasks'));
  assert.equal(h.calls[0].init.headers.get('X-BFF-Secret'),secret);
  assert.equal(h.calls[0].init.headers.get('X-BFF-Client-IP'),'203.0.113.8');
  assert.equal((await response.text()).includes(secret),false);
});
test('does not trust forwarded client IPs outside Vercel or accept invalid IPs',async()=>{
  for(const env of [{BFF_SHARED_SECRET:'s'.repeat(64)},{BFF_SHARED_SECRET:'s'.repeat(64),VERCEL:'1'}]){
    const h=harness(Response.json({data:{}}),'token',env);const req=request();req.headers.set('x-forwarded-for',env.VERCEL?'invalid':'203.0.113.8');
    await h.exports.GET(req,context('tasks'));assert.equal(h.calls[0].init.headers.has('X-BFF-Client-IP'),false);
  }
});
