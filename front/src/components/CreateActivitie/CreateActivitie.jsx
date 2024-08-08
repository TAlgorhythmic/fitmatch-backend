import './CreateActivitie.css'

function CreateActivitie() {
    return (
        <>
            <form className='form-create-activitie'>
                <p class="title">CREATE ACTIVITIE </p>
                <div class="flex">
                    <label>
                        <span>Title</span>
                    </label>

                    <label>
                        <input className="input-activitie" type="text" placeholder="" required="" />
                        <span>Description</span>
                    </label>
                </div>

                <label>
                    <input className="input-activitie" type="text" placeholder="" required="" />
                    <span>Post Date</span>
                </label>

                <label>
                    <input className="date-input" style={{ marginBottom: "10px" }} type="date" placeholder="" required="" />
                    <span>Expires</span>
                </label>
                <label>
                    <input className="input-activitie" type="text" placeholder="" required="" />
                </label>
                <div tabindex="0" class="plusButton">
                    <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                        <g mask="url(#mask0_21_345)">
                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                        </g>
                    </svg>
                </div>
            </form>
        </>
    )
}

export default CreateActivitie;