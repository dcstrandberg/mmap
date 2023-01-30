const LevelIndicator = (props) => {
    
    const levelIndicator = "[-] "
    const levelArray = new Array(props.level).fill(levelIndicator);

    return(
        <span className='LevelIndicator' >
            {levelArray}
        </span>
    )
}
export default LevelIndicator;    
