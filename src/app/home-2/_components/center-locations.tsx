"use client";

import { useState } from "react";
import { centerOffices } from "../../_data/offices";

export function CenterLocations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const office = centerOffices[activeIndex];
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`;

  const selectOffice = (index: number) => {
    if (index === activeIndex) return;
    setMapReady(false);
    setActiveIndex(index);
  };

  return (
    <section className="center-locations" aria-labelledby="center-locations-title">
      <div className="center-locations-heading">
        <p>Presença operacional</p>
        <h2 id="center-locations-title">Onde estamos</h2>
        <span>Matriz em São Paulo e filiais na Bahia e no Rio de Janeiro.</span>
      </div>

      <div className="center-locations-layout">
        <div className="center-locations-panel">
          <div className="center-locations-tabs" role="tablist" aria-label="Selecione uma unidade">
            {centerOffices.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls="center-location-map"
                onClick={() => selectOffice(index)}
              >
                <small>0{index + 1}</small>
                <span>{item.shortLabel}</span>
              </button>
            ))}
          </div>

          <address key={office.id} className="center-location-details">
            <span>{office.title}</span>
            <strong>{office.city}</strong>
            <p>{office.address}<br />{office.cep}</p>
            <div>
              {office.phones.map((phone) => (
                <a key={phone} href={`tel:+55${phone.replace(/\D/g, "")}`}>{phone}</a>
              ))}
            </div>
            <a className="center-location-route" href={directionsUrl} target="_blank" rel="noreferrer">
              Abrir rota no Google Maps <span aria-hidden="true">↗</span>
            </a>
          </address>
        </div>

        <div id="center-location-map" className={`center-location-map ${mapReady ? "is-ready" : ""}`} role="tabpanel">
          <div className="center-location-map-loading" aria-hidden="true">Carregando mapa</div>
          <iframe
            key={office.id}
            src={mapUrl}
            title={`Mapa da ${office.title} em ${office.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => setMapReady(true)}
          />
        </div>
      </div>
    </section>
  );
}
