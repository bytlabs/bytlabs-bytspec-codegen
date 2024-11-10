import Chance from "chance";

const randomName = () => {
    const chance = new Chance();
    const randomName = chance.word({ syllables: 3 })
    return randomName;
}

export default randomName;