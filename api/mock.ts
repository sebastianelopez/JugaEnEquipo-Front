import { User } from "../interfaces"

interface usersMockProps{
    users: User[],
}

export const usersMock:usersMockProps={
    users: [
        {
            _id: "1",
            nickname: "pepe123",
            name: "Pepe",
            lastname: "Rodriguez",
            password: '123456',
            email: "pepe@gmail.com",
            profileImage: "https://phantom-elmundo.unidadeditorial.es/c62dd4976a1f1729eb9ad9efc6c2c566/resize/1200/f/webp/assets/multimedia/imagenes/2020/06/05/15913424736370.jpg",
            role: "user",
            country: 'Argentina',
            games: [{
                _id: "1",
                name: "Overwatch",
                isVisible: true
            }]            
        },
        {
            _id: "2",
            nickname: "Carlos123",
            name: "Carlos",
            lastname: "Garcia",
            password: '123456',
            email: "Carlos@gmail.com",
            profileImage: "",
            role: "admin",
            country: 'Argentina',
            games: [{
                _id: "1",
                name: "Overwatch",
                isVisible: true
            }]                
        },
        {
            _id: "2",
            nickname: "Maria123",
            name: "Maria",
            lastname: "Perez",
            password: '123456',
            email: "MariaP@gmail.com",
            profileImage: "",
            role: "admin",
            country: 'Argentina',
            games: [{
                _id: "1",
                name: "Overwatch",
                isVisible: true
            }]                
        }
    ]
}