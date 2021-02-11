import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';

import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import { LeafletMouseEvent } from "leaflet";
import api from "../services/api";
import { useHistory } from "react-router-dom";


export default function CreateOrphanage() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpening_hours] = useState('');
  const [open_on_weekends , setOpen_on_weekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const history = useHistory();
  
  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files) return ;
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
    
    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    });
    setPreviewImages(selectedImagesPreview);
  }

  function handleMapClick(event: LeafletMouseEvent){
    const { lat, lng} = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    
    const { latitude, longitude } = position;
    const data = new FormData();

    data.append('name',name);
    data.append('latitude',String(latitude));
    data.append('longitude',String(longitude));
    data.append('about',about);
    data.append('instructions',instructions);
    data.append('opening_hours',opening_hours);
    data.append('open_on_weekends',String(open_on_weekends));
    images.forEach(image => {
      data.append('images',image);
    });
    
    await api.post('orphanages',data);
    
    alert('Cadastro realizado com Sucesso!');

    history.push('/app');
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar/>

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-22.8506061,-47.2046423]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

              {position.latitude!=0 && (
                <Marker 
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude,position.longitude]} />
                ) }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="about" maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label> 
              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img src={image} alt={name} key={image}/>
                  );
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple type="file" id="image[]" onChange={handleSelectImages}/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours"
                value={opening_hours}
                onChange={event => setOpening_hours(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekends?"active":""}
                  onClick={() => setOpen_on_weekends(true)}>Sim</button>
                <button
                  type="button"
                  className={!open_on_weekends?"active":""}
                  onClick={() => setOpen_on_weekends(false)}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
