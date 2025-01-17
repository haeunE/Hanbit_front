function Directions(){
  const location = useSelector((state) => state.isLocation); // 현재 위치
  const { data } = location.state || {}; 
  return(
    <div>

    </div>
  )
}

export default Directions;