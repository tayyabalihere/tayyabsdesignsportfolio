from pathlib import Path
import json
from PIL import Image
root=Path.cwd()
output=root/'public'/'optimized'
output.mkdir(exist_ok=True)
manifest={}
before=after=0
for source in (root/'public'/'uploads').iterdir():
    if source.suffix.lower() not in ['.png','.jpg','.jpeg','.webp']: continue
    with Image.open(source) as image:
        variants={}
        for label,width in [('small',360),('large',1000)]:
            resized=image.copy()
            resized.thumbnail((width,width),Image.Resampling.LANCZOS)
            target=output/(source.stem+'-'+label+'.webp')
            resized.save(target,'WEBP',quality=82,method=6)
            variants[label]='/optimized/'+target.name
            if label=='large': after+=target.stat().st_size
        before+=source.stat().st_size
        manifest['/uploads/'+source.name]=variants
(root/'src'/'data'/'portfolio-images.json').write_text(json.dumps(manifest,indent=2))
print(f'Images: {len(manifest)}; originals {before:,} bytes; optimized large {after:,} bytes; reduction {100*(1-after/before):.1f}%')
