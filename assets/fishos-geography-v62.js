/* Public regional references, never exact fishing spots. Existing values win. */
(function(root){
'use strict';
const refs=[
 [/katmai|naknek/i,'United States','Alaska',58.73,-156.99,'Naknek area'],
 [/la paz|baja/i,'Mexico','Baja California Sur',24.14,-110.31,'La Paz area'],
 [/belize|caye caulker/i,'Belize','Belize District',17.74,-88.03,'Caye Caulker area'],
 [/bighorn|fort smith/i,'United States','Montana',45.31,-107.93,'Fort Smith area'],
 [/metolius|dolly hole/i,'United States','Oregon',44.46,-121.64,'Camp Sherman area'],
 [/wickiup/i,'United States','Oregon',43.69,-121.69,'Wickiup Reservoir area'],
 [/imnaha|wallowa/i,'United States','Oregon',45.57,-116.83,'Imnaha area; multi-water trips may cover a wider area'],
 [/nestucca/i,'United States','Oregon',45.23,-123.86,'Hebo area'],
 [/billy chinook/i,'United States','Oregon',44.56,-121.28,'Lake Billy Chinook area'],
 [/east lake/i,'United States','Oregon',43.73,-121.21,'East Lake, Oregon assumed from trip context'],
 [/sauvie/i,'United States','Oregon',45.72,-122.82,'Sauvie Island area; other trip waters may differ'],
 [/crane/i,'United States','Oregon',43.80,-121.78,'Crane Prairie area assumed from trip context'],
 [/deschutes|cow meadows/i,'United States','Oregon',43.85,-121.78,'Upper Deschutes area'],
 [/coastal jetty/i,'United States','Oregon',45.57,-123.95,'Oregon coast / Tillamook Bay assumed; actual jetty unconfirmed']
];
const present=x=>x!==undefined&&x!==null&&String(x).trim()!=='';
function infer(trip,locations=[]){
 const t={...trip},text=[t.place,t.location,t.id,t.region].filter(Boolean).join(' '),r=refs.find(x=>x[0].test(text));
 if(!r)return t;
 const changed=[];
 if(!present(t.country)){t.country=r[1];changed.push('country')}
 if(!present(t.state)){t.state=r[2];changed.push('state')}
 if(changed.length)t.geography_note='Inferred '+changed.join(' and ')+' from place name; editable, please confirm.';
 // Preserve any partial existing coordinate instead of silently combining pairs.
 if(!present(t.lat)&&!present(t.lon)&&!present(t.lng)&&!present(t.latitude)&&!present(t.longitude)){
  const match=locations.find(x=>r[0].test(String(x.name||x.place||''))&&present(x.lat)&&present(x.lon)&&Number.isFinite(Number(x.lat))&&Number.isFinite(Number(x.lon)));
  t.lat=match?Number(match.lat):r[3];t.lon=match?Number(match.lon):r[4];
  t.coordinate_accuracy='approximate';t.coordinate_note=match?'Approximate trip reference from saved location; not an exact fishing spot.':'Estimated regional reference: '+r[5]+'. Not an exact fishing spot.';
 }
 return t;
}
root.fishosGeography62={infer,present};
})(typeof window==='undefined'?globalThis:window);
