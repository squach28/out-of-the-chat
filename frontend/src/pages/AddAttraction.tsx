const AddAttraction = () => {

    const onAddAttractionClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
    }

    return (
        <div>
            <h1 className="text-4xl font-bold">Add Attraction</h1>
            <form className="flex flex-col gap-2">
                <label htmlFor="">Name</label>
                <input className="border p-1" type="text" placeholder="Name" />
                <label htmlFor="">Description</label>
                <textarea className="border resize-none p-1" placeholder="Description"></textarea>
                <label htmlFor="">URL</label>
                <input className="border p-1" type="text" placeholder="URL" />
                <label htmlFor="">Price</label>
                <div className="flex gap-2 items-center">
                    <input type="radio" name="price" />
                    <p>$</p>
                    <input className="border p-1" type="number" placeholder="Price" />
                </div>
                <div className="flex gap-2">
                    <input id="free" type="radio" name="price" value="Free" />
                    <label htmlFor="free">Free</label>
                </div>
                <button className="bg-button-light text-button-text-light px-1 py-2 my-2 rounded-md" onClick={onAddAttractionClicked}>Add Attraction</button>
            </form>
        </div>
    )
}

export default AddAttraction