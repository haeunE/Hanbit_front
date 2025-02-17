import '../css/Pollutant.css'

function Pollutant() {
  return (
    <div id='Pollutant'>
      <section className='bundle'>
        <b className='title'>공기 오염물질</b>
        <p className='subtitle'>서울시의 현재 공기질은 어떤가요?</p>
        <div class="grid-container">
        <section className='box1'>
          <b className='title1'>PM2.5</b>
          <p className='subtitle'>지름 2.5 마이크로 미만의 미세먼지</p>
          <p className='value'>●10&micro;g/m<sup>3</sup></p>
        </section>
        <section className='box2'>
          <b className='title1'>PM10</b>
          <p className='subtitle'>지름 10 마이크로 미만의 미세먼지</p>
          <p className='value'>●20&micro;g/m<sup>3</sup></p>
        </section>
        <section className='box3'>
          <b className='title1'>O<sub>3</sub></b>
          <p className='subtitle'>오존</p>
          <p className='value'>●30&micro;g/m<sup>3</sup></p>
        </section>
        <section className='box4'>
          <b className='title1'>NO<sub>2</sub></b>
          <p className='subtitle'>이산화질소</p>
          <p className='value'>●40&micro;g/m<sup>3</sup></p>
        </section>
        <section className='box5'>
          <b className='title1'>SO<sub>2</sub></b>
          <p className='subtitle'>아황산가스</p>
          <p className='value'>●50&micro;g/m<sup>3</sup></p>
        </section>
        <section className='box6'>
          <b className='title1'>CO</b>
          <p className='subtitle'>일산화탄소</p>
          <p className='value'>●60&micro;g/m<sup>3</sup></p>
        </section>
        </div>
      </section>
    </div>
  )
}

export default Pollutant