import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function client(responses, env={}) {
  const calls=[];
  const exports={};
  const code=ts.transpileModule(fs.readFileSync('src/services/api-client.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code,{exports,Headers,FormData,process:{env:{NEXT_PUBLIC_USE_MOCK:'false',...env}},fetch:async(url,init)=>{calls.push({url,init});return responses.shift();}});
  return {api:exports.apiClient,calls};
}
test('loads every Laravel page instead of silently truncating the list',async()=>{
  const h=client([Response.json({data:[{id:1}],meta:{current_page:1,last_page:2}}),Response.json({data:[{id:2}],meta:{current_page:2,last_page:2}})]);
  const response=await h.api.all('/marketplace/offers?item_type=BOOK');
  assert.equal(JSON.stringify(response.data),'[{"id":1},{"id":2}]');
  assert.equal(h.calls[1].url,'/api/backend/marketplace/offers?item_type=BOOK&page=2&per_page=100');
});
test('does not return partial list data when a later page fails',async()=>{
  const h=client([Response.json({data:[{id:1}],meta:{last_page:2}}),Response.json({message:'Unavailable.'},{status:503})]);
  const response=await h.api.all('/tasks');
  assert.equal(response.data,null);assert.equal(response.status,503);assert.ok(response.errors);
});
test('multipart upload lets the browser generate its content-type boundary',async()=>{
  const h=client([Response.json({data:{id:1}},{status:201})]);
  const data=new FormData();data.set('title','course');
  await h.api.upload('/admin/library/resources',data);
  assert.equal(h.calls[0].init.headers.has('content-type'),false);
  assert.equal(h.calls[0].init.body,data);
  assert.equal(h.calls[0].init.credentials,'same-origin');
});
test('passes through field validation errors and an empty successful delete',async()=>{
  const h=client([Response.json({message:'Invalid.',code:'VALIDATION_FAILED',errors:{email:['Required.']}},{status:422}),new Response(null,{status:204})]);
  const invalid=await h.api.post('/auth/login',{});
  assert.equal(invalid.errors.email[0],'Required.');assert.equal(invalid.code,'VALIDATION_FAILED');
  const removed=await h.api.delete('/tasks/1');
  assert.equal(removed.status,204);assert.equal(removed.errors,null);
});


test('rejects oversized files before sending them through the Vercel proxy',async()=>{
  const h=client([],{NEXT_PUBLIC_LIBRARY_MAX_MB:'4'});const form=new FormData();form.set('file',new Blob([new Uint8Array(4*1024*1024+1)]),'large.pdf');
  const r=await h.api.upload('/library/contributions',form);assert.equal(r.status,413);assert.ok(r.errors.file);assert.equal(h.calls.length,0);
});
