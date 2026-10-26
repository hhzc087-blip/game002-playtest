import concurrent.futures, datetime, hashlib, json, pathlib, requests
from bs4 import BeautifulSoup

ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCES={
 'wechat-popular':'https://www.momorank.com/rankings/popular',
 'douyin-popular':'https://www.momorank.com/douyin/rankings/popular',
 'taptap-played':'https://www.taptap.cn/top/played',
 'taptap-popular':'https://www.taptap.cn/top/index',
 'google-casual-us':'https://www.appbrain.com/stats/google-play-rankings/top_free/casual/us',
 'google-puzzle-us':'https://www.appbrain.com/stats/google-play-rankings/top_free/puzzle/us',
 'apple-puzzle-us':'https://apps.apple.com/us/iphone/charts/7012?chart=top-free',
 'apple-casual-us':'https://apps.apple.com/us/iphone/charts/7003?chart=top-free',
 'poki-popular':'https://poki.com/en/popular',
 'crazy-hot':'https://www.crazygames.com/hot',
 'itch-popular':'https://itch.io/games/platform-web/tag-puzzle',
 'itch-rated':'https://itch.io/games/top-rated/platform-web/tag-puzzle',
 'taptap-h5-ad':'https://developer.taptap.cn/minigameapidoc/quick-start/mcp-guide/ad-integration-guide/',
 'block-official':'https://www.blockblast.com/',
}
def capture(item):
 key,url=item; out={'id':key,'url':url,'retrieved_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  r=requests.get(url,timeout=35,headers={'User-Agent':'Mozilla/5.0'});out.update(status=r.status_code,final_url=r.url,raw_sha256=hashlib.sha256(r.content).hexdigest())
  soup=BeautifulSoup(r.content,'html.parser')
  for el in soup(['script','style','noscript']):el.decompose()
  text=soup.get_text('\n',strip=True);(ROOT/f'evidence/research/{key}.txt').write_text(text)
  out['snapshot']=f'evidence/research/{key}.txt'
  rows=[]
  for tr in soup.select('table tr'):
   cols=[x.get_text(' ',strip=True) for x in tr.select('td,th')]
   if cols:rows.append(cols)
  out['table_rows']=rows
  out['links']=[{'text':a.get_text(' ',strip=True),'href':a.get('href')} for a in soup.select('a[href]') if a.get_text(' ',strip=True)]
 except Exception as e:out['error']=str(e)
 return out
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(capture,SOURCES.items()))
 (ROOT/'evidence/research/source-index.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
 for r in results: print(r['id'],r.get('status',r.get('error')),len(r.get('table_rows',[])))
