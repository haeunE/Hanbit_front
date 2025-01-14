import '../css/PlaceCard.css'

function PlaceCard({places}){
  
  return (
    <div className="place-container">
      {places.map((place) => (
        <div
          key={place.id}
          className="place-item"
          style={{ backgroundImage: `url(${place.img})` }}
        >
          <div className="img-info">
            <div className="place-addr">{place.add}</div>
            <div className="place-title">{place.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlaceCard