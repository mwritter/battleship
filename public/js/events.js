export default class Events {

    constructor(){
        this.id;
    }

    read = () => {
       return db.collection('Battleship').doc().get()
        .then((snapshot) => {
            console.log(snapshot.data());
        })
    }
    
    create = (players) => {
        return db.collection('Battleship')
            .add({})
            .then(ref => {
                return ref.id
            })
    }

}
