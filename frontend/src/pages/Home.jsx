import { useState, useEffect } from "react"
import api from "../api";
import Note from "../components/note"
import '../styles/home.css'


function Home() {
    const [ notes, setNotes ] = useState([]);
    const [ content, setContent ] = useState('');
    const [ title, setTitle ] = useState('');

    useEffect(() => {
        getNote();
    }, []);

    const getNote = async () => {
        try {
            const response = await api.get('/api/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('could not get notes', error);
            alert('could not get notes', error);
        }
    }

    const deleteNote = async (id) => {
        try {
            const response = await api.delete(`/api/notes/delete/${id}`);

            if (response.status === 204) {
                setNotes(notes.filter((note) => note.id !== id));
            } else {
                alert('Could not delete note');
            }
        } catch (error) {
            console.error('Could not delete note', error);
            alert('Could not delete note', error);
        }
    }

    const createNote = async () => {
        try {
            const response = await api.post('/api/notes', {
                content,
                title,
            });

            if (response.status === 201) {
                setNotes([...notes, response.data]);
            } else {
                alert('Could not create note');
            }
        } catch (error) {
            console.error('Could not create note', error);
            alert('Could not create note', error);
        }
    }

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>
            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    )
}

export default Home;