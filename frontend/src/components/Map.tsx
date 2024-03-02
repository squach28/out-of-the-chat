type MapProps = {
    query: string
}

const Map = (mapProps: MapProps) => {
  return (
    <div className="flex-1">
      <iframe
        title="google map"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAmVfKCETyY9jtb-pgS4jR4ShR-2JPJyrc&q=${mapProps.query}`}
        width="100%"
        height="500"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  )
}

export default Map