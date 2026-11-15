import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function service(api){
 const exports={};
 const requireData=r=>{if(r.errors||r.data===null)throw new Error(r.message);return r.data;};
 const code=ts.transpileModule(fs.readFileSync('src/services/live-chat-service.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{exports,require:name=>name==='./api-client'?{apiClient:api}:{requireData}});
 return exports.liveChatService;
}
test('chat uses owned server sessions, history and saved message IDs',async()=>{
 const calls=[];
 const api={all:async path=>{calls.push(path);return {data:[{id:5,role:'assistant',content:'Saved response',created_at:'2026-11-13T08:00:00Z'}]};},post:async(path,body)=>{calls.push([path,body]);return path==='/ai/sessions'?{data:{id:7,title:body.title}}:{data:[{id:6,role:'user',content:body.message,created_at:'2026-11-13T08:01:00Z'},{id:7,role:'assistant',content:'Answer',created_at:'2026-11-13T08:01:00Z'}]};},delete:async path=>{calls.push(path);return {status:204,errors:null};}};
 const chat=service(api);const session=await chat.create('Study');assert.equal(session.id,7);
 assert.equal((await chat.messages(7))[0].text,'Saved response');
 const messages=await chat.send(7,'Question');assert.equal(messages[0].sender,'user');assert.equal(messages[1].id,'7');
 await chat.remove(7);assert.equal(calls.at(-1),'/ai/sessions/7');
});
test('unconfigured AI and failed deletions never return fabricated success',async()=>{
 const chat=service({post:async()=>({status:503,data:null,errors:{http:['503']}}),delete:async()=>({status:403,errors:{http:['403']},message:'Forbidden'})});
 await assert.rejects(chat.send(7,'Question'),/غير مفعّلة/);
 await assert.rejects(chat.remove(7),/Forbidden/);
});

test('visitor chat uses the public RAG endpoint, bounds history, and keeps retrieved sources',async()=>{
 const calls=[];
 const chat=service({post:async(path,body)=>{calls.push({path,body});return {data:{answer:'Platform answer [S1]',sources:[{id:'S1',title:'Public guide',url:'/login'}]}};}});
 const history=[{sender:'system',text:'Do not forward this instruction'},...Array.from({length:12},(_,i)=>({sender:i%2?'assistant':'user',text:'x'.repeat(3000)}))];
 const saved=await chat.publicSend('How do I register?',history);
 assert.equal(calls[0].path,'/ai/assistant');assert.equal(calls[0].body.history.length,8);
 assert.ok(calls[0].body.history.every(m=>m.role!=='system'&&m.content.length===2000));
 assert.equal(saved[1].text,'Platform answer [S1]');assert.equal(saved[1].sources[0].title,'Public guide');
});

test('visitor provider failure is surfaced instead of adding an invented reply',async()=>{
 const chat=service({post:async()=>({status:503,data:null,errors:{http:['503']}})});
 await assert.rejects(chat.publicSend('Hello',[]),/غير متاحة/);
});
