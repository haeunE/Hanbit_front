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
            <p className='subtitle'>지름 2.5 마이크로 미만의 미세먼지</p>
            <p className='value'>●{cityAir.pm25}&micro;g/m<sup>3</sup></p>
          </section>
          <section className='box2'>
            <b className='title1'>PM10</b>
            <p className='subtitle'>지름 10 마이크로 미만의 미세먼지</p>
            <p className='value'>●{cityAir.pm10}&micro;g/m<sup>3</sup></p>
          </section>
          <section className='box3'>
            <b className='title1'>O<sub>3</sub></b>
            <p className='subtitle'>오존</p>
            <p className='value'>●{cityAir.o3}&micro;g/m<sup>3</sup></p>
          </section>
          <section className='box4'>
            <b className='title1'>NO<sub>2</sub></b>
            <p className='subtitle'>이산화질소</p>
            <p className='value'>●{cityAir.no2}&micro;g/m<sup>3</sup></p>
          </section>
          <section className='box5'>
            <b className='title1'>SO<sub>2</sub></b>
            <p className='subtitle'>아황산가스</p>
            <p className='value'>●{cityAir.so2}&micro;g/m<sup>3</sup></p>
          </section>
          <section className='box6'>
            <b className='title1'>CO</b>
            <p className='subtitle'>일산화탄소</p>
            <p className='value'>●{cityAir.co}&micro;g/m<sup>3</sup></p>
          </section>
        </div>
      </section>
    </div>
  )
}

export default Pollutant