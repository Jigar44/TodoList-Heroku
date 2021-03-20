
exports.getDate = function(){

    const today = new Date()
    
    const option ={
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    return today.toLocaleDateString('en-US', option)
} 


exports.getDay = function () {  

    const toDay = new Date()

    const option = {
        weekday : "long"
    }

    return toDay.toLocaleDateString('en-US', option)
}