"""Build app/data/machines.js from data/*.json; copy zone images; report integrity issues."""
import json,glob,os,shutil,hashlib,sys
SP=os.path.dirname(os.path.abspath(__file__)); APP=os.path.dirname(SP)
os.makedirs(os.path.join(APP,'data'),exist_ok=True); os.makedirs(os.path.join(APP,'img'),exist_ok=True)
order={'BE4-768036':0,'P4-787017':1}
ms=[]; issues=[]
for f in sorted(glob.glob(os.path.join(SP,'data','*.json')),key=lambda f:order.get(os.path.basename(f)[:-5],9)):
    m=json.load(open(f,encoding='utf-8'))
    ids=set()
    for z in m.get('zones',[]):
        img=z.get('image')
        if img:
            src=os.path.join(SP,img) if os.path.exists(os.path.join(SP,img)) else os.path.join(SP,'img',os.path.basename(img))
            dst=os.path.join(APP,'img',os.path.basename(img))
            if os.path.exists(src): shutil.copy(src,dst); z['image']='img/'+os.path.basename(img)
            elif os.path.exists(dst): z['image']='img/'+os.path.basename(img)
            else: issues.append(f"{m['id']} {z['id']}: image missing {img}"); z['image']=None
        for p in z.get('points',[]):
            if p['id'] in ids: issues.append(f"duplicate id {p['id']}")
            ids.add(p['id'])
            if p.get('cat') not in ('C','I','L','T'): issues.append(f"{p['id']}: bad cat")
            if not p.get('ref') and not p.get('demo'): issues.append(f"{p['id']}: no ref")
            for k in ('quantity','torque'):
                if p.get(k) and not p.get('ref'): issues.append(f"{p['id']}: {k} without ref")
            if not (p.get('title') or {}).get('ar'): issues.append(f"{p['id']}: no Arabic title")
    ms.append(m)
blob=json.dumps(ms,ensure_ascii=False,separators=(',',':'))
ver=hashlib.sha1(blob.encode()).hexdigest()[:10]
open(os.path.join(APP,'data','machines.js'),'w',encoding='utf-8').write('/* Generated from Körber BE4 768036 / P4 787017 documentation. Edit in Admin or regenerate. */\nwindow.CILT_SEED={"version":"'+ver+'","machines":'+blob+'};\n')
imgs=sorted({z['image'] for m in ms for z in m['zones'] if z.get('image')})
open(os.path.join(APP,'data','images.js'),'w').write('self.CILT_IMGS='+json.dumps(imgs)+';\n')
for m in ms:
    pts=[p for z in m['zones'] for p in z['points']]
    print(m['id'],len(m['zones']),'zones',len(pts),'pts', {c:sum(p['cat']==c for p in pts) for c in 'CILT'}, 'unvalidated',sum(p.get('validated') is False for p in pts))
print('version',ver,'size',len(blob)); print('ISSUES',len(issues)); print('\n'.join(issues[:40]))
