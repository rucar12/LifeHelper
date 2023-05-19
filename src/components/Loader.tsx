
const Loader = () => {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
            <circle className="loader-circle" cx="25" cy="25" r="20" fill="none" stroke="#969696" strokeWidth="4">
                <animate attributeName="stroke-dasharray" attributeType="XML" from="40, 100" to="40, 125, 125, 100"
                         dur="5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="1800 25 25" dur="5s"
                                  repeatCount="indefinite"/>
            </circle>
        </svg>
    )
}

export default Loader;