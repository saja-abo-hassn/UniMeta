import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function harness() {
 const calls=[]; const exports={};
 const invitation={id:7,name:'Staff',email:'staff@example.test',title:null,department:null,permissions:{manage_content:true},created_at:'2026-01-01',expires_at:'2099-01-01',accepted_at:null,cancelled_at:null};
 const apiClient={post:async(path,body)=>{calls.push({path,body});return {data:{invitation,inviteUrl:'https://frontend.test/invite/secret'},errors:null};},patch:async(path,body)=>{calls.push({path,body});return {data:{id:'3'},errors:null};},get:async()=>({data:[{id:'3'}],errors:null}),all:async()=>({data:[invitation,{...invitation,id:8,accepted_at:'2026-01-02'}],errors:null}),delete:async(path)=>{calls.push({path});return {data:{cancelled:true},errors:null};}};
 const code=ts.transpileModule(fs.readFileSync('src/services/moderators/real-moderators-service.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{exports,URL,require:()=>({apiClient})});return {service:new exports.RealModeratorsService(),calls};
}
test('invitation adapts keyed permissions and Laravel invitation response',async()=>{
 const h=harness();const r=await h.service.invite({name:'Staff',permissions:{manage_content:true,manage_exams:false}});
 assert.equal(JSON.stringify(h.calls[0].body.permissions),'{"manage_content":true}');
 assert.equal(r.data.moderator.id,'invitation-7');assert.equal(r.data.moderator.status,'دعوة معلّقة');assert.equal(r.data.token,'secret');
});
test('unsupported enabled permissions are surfaced before writing',async()=>{
 const h=harness();await assert.rejects(h.service.updatePermissions('3',{manage_content:true,manage_settings:true}));assert.equal(h.calls.length,0);
});
test('permission writes retain sensitive-data permission and omit unsupported false keys',async()=>{
 const h=harness();await h.service.updatePermissions('3',{manage_content:true,view_sensitive:true,manage_settings:false});
 assert.equal(JSON.stringify(h.calls[0].body.permissions),'{"manage_content":true,"view_sensitive":true}');
});
test('loads pending invitations and cancels using invitation IDs rather than user IDs',async()=>{
 const h=harness();const r=await h.service.list();assert.equal(r.data.length,2);assert.equal(r.data[1].id,'invitation-7');
 await h.service.delete('invitation-7');assert.equal(h.calls[0].path,'/admin/invitations/7');
 await assert.rejects(h.service.setStatus('invitation-7','نشط'));
});
