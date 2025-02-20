import '../css/Pollutant.css'

function Pollutant({cityAir}) {
  if (!cityAir || cityAir.length === 0) {
    return <p>데이터를 불러오는 중...</p>;
  }
  return (
    <div className='pollutant'>
      <section className='bundle'>
        <b className='title'>공기 오염물질</b>
        <p className='subtitle'>{cityAir.goname}의 현재 공기질은 어떤가요?</p>
        <div className="grid-container">
          <section className='box1'>
            <b className='title1'>PM2.5</b>
            <div className='subtitle'>지름 2.5 마이크로 미만의 미세먼지</div>
            <div className='value'>{cityAir.pm25}&micro;g/m<sup>3</sup></div>
          </section>
          <section className='box2'>
            <b className='title1'>PM10</b>
            <div className='subtitle'>지름 10 마이크로 미만의 미세먼지</div>
            <div className='value'>{cityAir.pm10}&micro;g/m<sup>3</sup></div>
          </section>
          <section className='box3'>
            <b className='title1'>O<sub>3</sub></b>
            <div className='subtitle'>오존</div>
            <div className='value'>{cityAir.o3}&micro;g/m<sup>3</sup></div>
          </section>
          <section className='box4'>
            <b className='title1'>NO<sub>2</sub></b>
            <div className='subtitle'>이산화질소</div>
            <div className='value'>{cityAir.no2}&micro;g/m<sup>3</sup></div>
          </section>
          <section className='box5'>
            <b className='title1'>SO<sub>2</sub></b>
            <div className='subtitle'>아황산가스</div>
            <div className='value'>{cityAir.so2}&micro;g/m<sup>3</sup></div>
          </section>
          <section className='box6'>
            <b className='title1'>CO</b>
            <div className='subtitle'>일산화탄소</div>
            <div className='value'>{cityAir.co}&micro;g/m<sup>3</sup></div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default Pollutant