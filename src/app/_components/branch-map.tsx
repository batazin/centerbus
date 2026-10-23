"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MapInstance } from "maplibre-gl";
import { branches } from "../_content/branches";

const locations = {
  SP: { center: [-46.5913571,-23.5224626] as [number,number], zoom:15.5 },
  BA: { center: [-38.311581,-12.882553] as [number,number], zoom:14.5 },
  RJ: { center: [-43.51031721498646,-23.002614585796117] as [number,number], zoom:15 },
};

export function BranchMap({ branch }: { branch: typeof branches[number] }) {
  const container = useRef<HTMLDivElement>(null);
  const [status,setStatus] = useState<"loading"|"ready"|"error">("loading");
  useEffect(() => {
    const element=container.current;if(!element)return;
    let disposed=false,map:MapInstance|undefined;
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();
      import("maplibre-gl").then(({Map,Marker,NavigationControl,setWorkerUrl})=>{
        if(disposed)return;
        setWorkerUrl("/brand/maplibre-gl-worker.js");
        const location=locations[branch.state];
        map=new Map({container:element,style:"/brand/center-map-style.json",center:location.center,zoom:location.zoom,scrollZoom:false,cooperativeGestures:true,attributionControl:{compact:true},locale:{"NavigationControl.ZoomIn":"Aproximar mapa","NavigationControl.ZoomOut":"Afastar mapa","CooperativeGesturesHandler.WindowsHelpText":"Use Ctrl + rolagem para ampliar","CooperativeGesturesHandler.MacHelpText":"Use ⌘ + rolagem para ampliar","CooperativeGesturesHandler.MobileHelpText":"Use dois dedos para mover o mapa"}});
        map.dragRotate.disable();map.touchZoomRotate.disableRotation();
        map.addControl(new NavigationControl({showCompass:false}),"top-right");
        const pin=document.createElement("div");pin.className="center-map-pin";pin.setAttribute("aria-label",branch.state==="BA"?"Referência da Rua Pelicano pelo CEP":branch.name);
        pin.innerHTML='<span aria-hidden="true"></span>';
        new Marker({element:pin,anchor:"bottom"}).setLngLat(location.center).addTo(map);
        map.once("load",()=>{if(!disposed)setStatus("ready");});
        map.on("error",()=>{if(!disposed&&!map?.isStyleLoaded())setStatus("error");});
      }).catch(()=>{if(!disposed)setStatus("error");});
    },{rootMargin:"150px"});
    observer.observe(element);
    return()=>{disposed=true;observer.disconnect();map?.remove();};
  },[branch]);
  return <div className={`office-map center-map is-${status}`}>
    <div ref={container} className="center-map-canvas" role="region" aria-label={`Mapa de localização: ${branch.name}`} />
    {status!=="ready" && <div className="center-map-status" role="status">{status==="loading"?"Carregando mapa…":"Abra a rota para consultar a localização."}</div>}
    <div className="center-map-caption"><span className="center-map-caption-dot" />{branch.state==="BA"?"Rua Pelicano · localização aproximada":branch.name}</div>
  </div>;
}
