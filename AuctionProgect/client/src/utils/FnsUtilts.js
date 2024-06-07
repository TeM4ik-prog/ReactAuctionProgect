import axios from "axios"
import localSitePath from "../../localSitePath"

let Letters = "qwertyuiopasddfghjkklzxcvbnnm"



function RandPassword() {
    let randPassword = ''
    for (let i = 0; i < RandInt(12, 18); i++) {
        if (RandInt(0, 1) == 0) {
            randPassword += rand_Letter()
        }
        else {
            randPassword += String(RandInt(0, 9))
        }
    }
    return randPassword
}


function RandInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1))
}

function RandElemFromAr(array) {
    return array[RandInt(0, array.length - 1)]
}

function rand_Letter() {
    let letter = Letters[RandInt(0, Letters.length - 1)]
    return RandInt(0, 1) == 0 ? letter.toLowerCase() : letter.toUpperCase()
}


function addProducts() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            axios.post(
                `${localSitePath}/auth/addProd`,
                { name: `artem${i}`, price: RandInt(100, 1000), categoryId: RandInt(1, 10) },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                // .then(response => console.log(response.data))
                .catch(error => console.log('Ошибка:' + error));

        }, 500 * i);
    }



}













export {
    RandElemFromAr,
    RandInt, RandPassword, addProducts
}

