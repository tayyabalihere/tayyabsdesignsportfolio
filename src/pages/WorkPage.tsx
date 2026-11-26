import { MotionMarquee } from '../components/home/PortfolioMotion';
import { useEffect, useMemo, useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { StudioProjectCard } from '../components/common/StudioProjectCard';
interface WorkPageProps { navigate: (path: string) => void; queryParams?: Record<string,string>; }
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g,'-');
export const WorkPage = ({navigate, queryParams = {}}: WorkPageProps) => {
 const { projects: allProjects } = useCMS();
 const [category,setCategory] = useState(queryParams.category || 'all');
 const [garment,setGarment] = useState(queryParams.garment || 'all');
 const [year,setYear] = useState(queryParams.year || 'all');
 const [search,setSearch] = useState(queryParams.search || '');
 const [sort,setSort] = useState('featured');
 useEffect(() => { setCategory(queryParams.category || 'all');setGarment(queryParams.garment || 'all');setYear(queryParams.year || 'all');setSearch(queryParams.search || ''); },[queryParams.category,queryParams.garment,queryParams.year,queryParams.search]);
 const projects=allProjects.filter(project => !project.isDraft);
 const categories=[...new Set(projects.flatMap(project => [project.category,...project.categories]))];
 const garments=[...new Set(projects.flatMap(project => project.garmentTypes))];
 const years=[...new Set(projects.map(project=>project.year))].sort((a,b)=>Number(b)-Number(a));
 const filtered=useMemo(() => allProjects.filter(project=>!project.isDraft).filter(project =>
  (category==='all' || [project.category,...project.categories].some(item=>slugify(item)===category)) &&
  (garment==='all' || project.garmentTypes.some(item=>slugify(item)===garment)) &&
  (year==='all' || String(project.year)===year) &&
  (!search.trim() || `${project.title} ${project.brandName} ${project.category}`.toLowerCase().includes(search.toLowerCase().trim()))
 ).sort((a,b)=>sort==='newest'?Number(b.year)-Number(a.year):sort==='oldest'?Number(a.year)-Number(b.year):Number(b.isFeatured)-Number(a.isFeatured)),[allProjects,category,garment,year,search,sort]);
 const gallery = useMemo(() => filtered.flatMap(project => {
  const images=[...new Set([project.mockups.heroMockup,project.mockups.frontMockup,project.mockups.backMockup,...(project.mockups.collectionViews || [])].filter((image): image is string => Boolean(image)))];
  return images.slice(0,3).map((image,index)=>({...project,id:project.id+'-view-'+index,mockups:{...project.mockups,heroMockup:image}}));
 }),[filtered]);
 const rowCount=Math.min(4,Math.max(1,Math.ceil(gallery.length/4)));
 const galleryRows=Array.from({length:rowCount},(_,index)=>gallery.filter((_,itemIndex)=>itemIndex%rowCount===index));
 const update=(next: {category?:string;garment?:string;year?:string;search?:string}) => {
  const values={category,garment,year,search,...next};
  setCategory(values.category);setGarment(values.garment);setYear(values.year);setSearch(values.search);
  const params=new URLSearchParams();Object.entries(values).forEach(([key,value])=>{if(value && value!=='all') params.set(key,value);});
  window.history.replaceState(null,'',`/work${params.size?'?'+params.toString():''}`);
 };
 return <div className="reference-archive"><div className="reference-heading"><h1>Selected projects</h1><span>( Archive )</span></div><details className="archive-filter-panel"><summary>Filter projects</summary><div className="archive-tools"><input aria-label="Search projects" placeholder="Search projects or brands" value={search} onChange={event=>update({search:event.target.value})}/><select aria-label="Garment type" value={garment} onChange={event=>update({garment:event.target.value})}><option value="all">All garments</option>{garments.map(item=><option key={item} value={slugify(item)}>{item}</option>)}</select><select aria-label="Project year" value={year} onChange={event=>update({year:event.target.value})}><option value="all">All years</option>{years.map(item=><option key={item} value={String(item)}>{item}</option>)}</select><select aria-label="Sort projects" value={sort} onChange={event=>setSort(event.target.value)}><option value="featured">Featured first</option><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select><span className="archive-count">{filtered.length} {filtered.length===1?'project':'projects'}</span></div><div className="archive-categories" aria-label="Filter by category"><button aria-pressed={category==='all'} onClick={()=>update({category:'all'})}>All work</button>{categories.map(item=><button key={item} aria-pressed={category===slugify(item)} onClick={()=>update({category:slugify(item)})}>{item}</button>)}</div></details>{filtered.length?<div className="archive-moving-grid">{galleryRows.map((row,index)=><MotionMarquee key={index} items={row} minimumItems={4} className="work-marquee archive-marquee" duration={60+index*6} reverse={index%2===1} label={`Portfolio row ${index+1}`} renderItem={(project,_,duplicate)=><StudioProjectCard project={project} navigate={navigate} marquee duplicate={duplicate}/>}/>)}</div>:<div className="archive-empty"><p>No projects match your filters.</p><button className="outline-link" onClick={()=>{update({category:'all',garment:'all',year:'all',search:''});setSort('featured');}}>Clear filters</button></div>}</div>;
};
