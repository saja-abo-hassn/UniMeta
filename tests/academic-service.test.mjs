import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function service(failDetails=false){
 const exports={};const calls=[];
 const data={
  '/academic-plans':[{id:2,major_id:1,plan_name:'Server plan',total_required_hours:120}],
  '/majors':[{id:1,name:'علوم الحاسوب'}],
  '/students/me/academic-plan':{academic_plan_id:2},
  '/students/me/courses':[{id:8,course_id:11,attempt_number:1,grade:'95'},{id:9,course_id:11,attempt_number:2,grade:'0'}],
  '/academic-plans/2/courses':[{course_id:11,course_code:'ITCS1401',course_name:'Server course',credit_hours:3,description:null,requirement_category_id:4}],
  '/academic-plans/2/requirements':[{id:4,kind:'MANDATORY',scope:'COLLEGE',required_hours:3}],
  '/academic-plans/2/details':{college:'Server college',degree:'MASTER',semesters_count:4,tuition_rate:{hourly_rate:'17.50'},course_semesters:[{course_id:11,semester:3}]},
 };
 const get=async path=>{calls.push(path);return path.endsWith('/details')&&failDetails?{data:null,errors:{http:['503']},message:'Unavailable'}:{data:data[path]};};
 const code=ts.transpileModule(fs.readFileSync('src/services/academic-service.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{exports,require:name=>name==='./api-client'?{apiClient:{get,all:get}}:{requireData:r=>{if(r.errors||r.data===null)throw new Error(r.message);return r.data;}}});
 return {api:exports.academicService,calls};
}
test('academic plans use server metadata, course semesters and latest zero grade',async()=>{
 const h=service();const result=await h.api.load();const p=result.plans[0];
 assert.equal(p.college,'Server college');assert.equal(p.degree,'ماجستير');assert.equal(p.semestersCount,4);assert.equal(p.hourlyRate,17.5);
 assert.equal(p.courses[0].semester,3);assert.equal(p.courses[0].credits,3);assert.equal(result.grades.ITCS1401,0);
});
test('failed plan metadata is surfaced without substituting local mock data',async()=>{
 await assert.rejects(service(true).api.load(),/Unavailable/);
});
