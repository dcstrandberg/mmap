const LevelIndicator = (props) => {
    
    const levelIndicator = <div className='LevelTick'></div>;
    const levelArray = new Array(props.level).fill(levelIndicator);

    return(
        <span className='LevelIndicator' >
            {levelArray}
        </span>
    )
}
export default LevelIndicator;    
