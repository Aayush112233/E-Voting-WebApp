export const darkModeService = () => {
    return (dispatch) => {
        dispatch({type:"TOGGLE_DARK_MODE"})
    }
}