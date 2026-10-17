export default async function Deals({params}){

    const {id} = await params
    return (
        <>
            <h1>LFG THIS IS THE {id} Deal !</h1>
        </>
    )
}