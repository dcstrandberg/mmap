const LevelIndicator = (props) => {
    
    // const levelIndicator = ;
    const levelArray = new Array(props.level).fill(0).map((x, i) => {
        return <div key={i} className='LevelTick'></div>
    });

    return(
        <span className='LevelIndicator' >
            {levelArray}
        </span>
    )
}
export default LevelIndicator;    
