"""Build an immutable, minimal review snapshot; independently check members/CRC/hash."""
import datetime,hashlib,json,pathlib,shutil,zipfile,os
ROOT=pathlib.Path(__file__).resolve().parents[1]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
now=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8)))
stamp=now.strftime('%Y%m%dT%H%M%S')+'-game002-r1'
archive=ROOT/'handoff/archive'/stamp
if archive.exists():raise RuntimeError('Immutable archive already exists')
archive.mkdir(parents=True)
selected=['AGENTS.md','README.md','PUBLISH_HANDOFF.md','THREAD_SUMMARY.md','REPORT.md','REVIEW_REQUEST.md','REVIEW.html','THIRD_PARTY_NOTICES.md','index.html','style.css','package.json','package-lock.json']
for pattern in ['src/*.mjs','third_party/*','tests/*.mjs','scripts/*.mjs','scripts/*.py','docs/**/*.md','docs/research/*.csv','docs/research/*.json','evidence/licenses/upstream-pins.json','evidence/licenses/selected-upstream/*','evidence/runtime/rules-*.txt','evidence/runtime/browser-tests*.json','evidence/runtime/browser-tests*log.txt','evidence/runtime/upstream*.json','evidence/runtime/upstream-*-build.txt','evidence/runtime/upstream-10block-tests.txt','evidence/runtime/*recording-probe.json']:
 selected.extend(str(p.relative_to(ROOT))for p in ROOT.glob(pattern)if p.is_file())
selected.extend('evidence/runtime/'+n for n in ['remote-preview.json','preservation-after.json','resource-cleanup.json','tower-parameter-sweep.json','pages-created.json','preview-deploy-failure-01.txt'])
selected.extend('evidence/research/'+n for n in ['source-index.json','dataset-validation.json','reference-runtime.json','reference-runtime-log.txt','royal-smash-listing.json','sand-blocks-listing.json','official-portal-previews.json','apple-puzzle-us.txt','taptap-played.txt','poki-popular.txt','taptap-h5-ad.txt'])
selected.extend('output/playwright/'+n for n in ['home-390.png','home-1280.png','blocks-390.png','blocks-1280.png','sort-390.png','sort-1280.png','tower-390.png','tower-1280.png','blocks-result.png','sort-result.png','tower-result.png','upstream-10block-played.png','upstream-sort-poured.png','upstream-matter-slingshot.png','upstream-sort-mit-web-attempt.png','ref-royal-contact.jpg','ref-sand-contact.jpg','reference-attempts-contact.jpg','remote-home.png','remote-blocks.png','remote-sort.png','remote-tower.png','blocks-operations.mp4','sort-operations.mp4','tower-operations.mp4'])
selected=sorted(set(selected))
for name in selected:
 src=ROOT/name
 if not src.is_file():raise FileNotFoundError(name)
 if any(p in name.split('/')for p in ['node_modules','vendor','.git','dist']):raise RuntimeError('Excluded dependency/build')
 dst=archive/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
review=['THREAD_SUMMARY.md','REPORT.md','REVIEW_REQUEST.md','REVIEW.html','PUBLISH_HANDOFF.md','README.md']
manifest={'task':'GAME 002 multi-market research and three Human-playable H5 candidates','status':'PARTIAL','created_at':now.isoformat(),'human_acceptance':'PENDING','release_to_taptap':False,'archive_subdir':'handoff/archive/'+stamp,'changed_files':[n for n in selected if n.startswith(('src/','scripts/','tests/','docs/','third_party/'))or n in ['AGENTS.md','README.md','index.html','style.css','package.json','package-lock.json','THIRD_PARTY_NOTICES.md']]+['../AGENTS.md (scope update only)','../.git/info/exclude (ignore nested GAME_002)'],'review_files':review,'evidence_files':[n for n in selected if n.startswith(('evidence/','output/'))],
 'tests':{'passed':['12 GAME002 domain tests','59 unique games / 8 market groups schema check','400 independently solved sort seeds + 200 executable reverse witnesses','100 constructive three-piece deals','15 initial physics layouts + all 70 parameter combinations in both modes (140 cases)','30 initial touch terminal rounds (10 wins each game)','10 tower rounds after projectile-settlement fix','10 sort rounds after MIT core port','360/390/430/1280 viewport checks','3 WebKit startup/render checks (not ten rounds)','10block upstream build + 379 tests + actual drag','unlicensed sorting upstream build + actual pour (no reuse)','Matter upstream example actual drag and simulation','remote homepage + 3 game startup checks'], 'failed':[], 'historical_failures':['missing modules before implementation','tower lower launch blocked by platform','late airborne projectile premature-win regression','initial tool-cache ffmpeg mismatch','commercial portal resource/connection failures','MIT Godot upstream only reached published loading bar','Vercel invalid credentials/fallback connection failure; private Pages plan rejected']},
 'runtime_verified':{'game002':'Headless Chromium actual UI touch rounds and screenshots/recordings; WebKit startup/layout only; public GitHub Pages four routes','upstream':'10block actual drag; unlicensed sorting actual pour; Matter official slingshot drag; MIT Godot native build NOT RUN','not_verified':['Human fun/ten-round willingness','real iOS/Android devices','TapTap host','advertisement SDK/authorization/revenue','15 commercial games fully hands-on or normal-speed AV']},
 'review_bundle':{'path':'review_bundle.zip','sha256_sidecar':'review_bundle.sha256','sha256_policy':'Each payload member hash is in file_sha256. The ZIP byte hash is in the external sidecar; no impossible self-referential manifest hash.','expected_members':sorted(selected+['MANIFEST.json'])},
 'external_evidence':[{'path':'evidence/runtime/preservation-before.json','sha256':digest(ROOT/'evidence/runtime/preservation-before.json'),'reason':'Full pre-run file ownership/hash index retained locally; minimal review includes after-check summary, not 17,783 unrelated old-project file names.'}],
 'file_sha256':{n:digest(archive/n)for n in selected},'orphan_count':0,'codex_global_config_changes':False}
(archive/'MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
zpath=archive/'review_bundle.zip'
with zipfile.ZipFile(zpath,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6)as z:
 for name in manifest['review_bundle']['expected_members']:z.write(archive/name,name)
zsha=digest(zpath);(archive/'review_bundle.sha256').write_text(zsha+'  review_bundle.zip\n')
with zipfile.ZipFile(zpath)as z:
 assert z.testzip()is None
 assert sorted(z.namelist())==manifest['review_bundle']['expected_members']
 for name,sha in manifest['file_sha256'].items():assert hashlib.sha256(z.read(name)).hexdigest()==sha,name
 assert json.loads(z.read('MANIFEST.json'))==manifest
assert zsha==(archive/'review_bundle.sha256').read_text().split()[0]
verification={'status':'PASS','zip_crc':'PASS','exact_members':'PASS','all_member_sha256':'PASS','zip_sha256':zsha,'members':len(manifest['review_bundle']['expected_members']),'bytes':zpath.stat().st_size,'created_at':now.isoformat(),'archive':str(archive),'scope':'Local handoff only; remote download verification is a separate record after upload.'}
(archive/'HANDOFF_VERIFICATION.json').write_text(json.dumps(verification,ensure_ascii=False,indent=2)+'\n')
latest=ROOT/'handoff/latest'
if latest.exists():
 old=json.loads((latest/'MANIFEST.json').read_text());oldarchive=ROOT/old['archive_subdir']
 assert oldarchive.exists()and digest(oldarchive/'review_bundle.zip')==digest(latest/'review_bundle.zip'),'Previous latest not safely archived'
 shutil.rmtree(latest)
shutil.copytree(archive,latest)
assert digest(latest/'review_bundle.zip')==zsha
for p in archive.rglob('*'):
 if p.is_file():os.chmod(p,0o444)
print(json.dumps(verification,ensure_ascii=False,indent=2))
