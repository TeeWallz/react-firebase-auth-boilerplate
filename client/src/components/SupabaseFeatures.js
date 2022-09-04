import { useRef, useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'

import { useAuth } from '../contexts/Auth'
import { Google_Button_SignIn, Github_Button_SignIn, Email_Button_SignIn } from './LoginButtons'
import { supabase } from '../supabase'

export function SupabaseFeatures() {
    // Addition feature state
    const number1Ref = useRef()
    const number2Ref = useRef()
    const answerRef = useRef()

    // Message feature state
    // Current messages
    let [messages, setMessages] = useState({})
    // New message field
    const newMessageRef = useRef()
    // Message recieved from API via listener
    const [newMessageFromListener, handleNewMessageFromListener] = useState(null)


    // Get signUp function from the auth context
    const { user } = useAuth()
    const history = useHistory()

    // Add Feature Stuff
    async function handleAddSubmit(e) {
        e.preventDefault()

        let number1 = number1Ref.current.value
        let number2 = number2Ref.current.value
        if (!(number1)) { alert('Number 1 empty.'); return; }
        if (!(number2)) { alert('Number 2 empty.'); return; }

        let { data, error } = await supabase
            .rpc('add', {
                i: number1,
                j: number2,
            })

        if (error) console.error(error)
        else console.log(data)

        answerRef.current.value = data
    }





    // Message stuff
    // On load, reload all messages
    async function getMessages() {
        let { data: message_data, error } = await supabase
            .from('messages')
            .select('*')

        setMessages(message_data.reduce((obj, item) => Object.assign(obj, { [item.message_id]: item }), {}))
    }

    // Listen for new messages, and use handleNewMessageFromListener/newMessageFromListener to recieve the update
    useEffect(() => {
        getMessages();

        const messageListener = supabase
            .from('messages')
            .on('*', (payload) => handleNewMessageFromListener(payload.new))
            .subscribe()
    });
    // Listen for a new message in handleNewMessageFromListener
    useEffect(() => {
        if (newMessageFromListener) {
            const handleAsync = async () => {
                // let authorId = newMessage.user_id
                setMessages(messages.concat(handleNewMessageFromListener))
            }
            handleAsync()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleNewMessageFromListener])


    async function handleMessageSubmit(e) {
        e.preventDefault();

        let newMessage = newMessageRef.current.value
        if (!(newMessage)) { alert('Message empty.'); return; }

        const { data, error } = await supabase
            .from('messages')
            .insert([
                { message: newMessage },
            ])

        if (error) console.error(error)
        else console.log(data)


    }





    return (
        <>
            <h2>Addition Postgres Function API</h2>
            <form onSubmit={handleAddSubmit}>
                <div style={{ display: 'flex' }}>
                    <div>
                        <label htmlFor="input-email">Number 1</label>
                        <input id="input-email" type="number" ref={newMessageRef} style={{ width: '150px' }} autoComplete="none" />
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <label htmlFor="input-email" >Number 2</label>
                        <input id="input-email" type="number" ref={number2Ref} style={{ width: '150px' }} />
                    </div>
                    <div style={{ marginLeft: '20px', paddingTop: '55px' }}>
                        =
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                        <label htmlFor="input-email" >Answer from Server</label>
                        <input id="input-email" type="number" ref={answerRef} style={{ width: '150px' }} />
                    </div>
                </div>

                <br />

                <button type="submit">Add!</button>
                <br />
            </form>

            <h2>Add Message:</h2>
            <form onSubmit={handleMessageSubmit}>
                <div style={{ display: 'flex' }}>
                    <div>
                        <label htmlFor="input-message">Message</label>
                        <input id="input-message" type="text" ref={newMessageRef} style={{ width: '600px' }} autoComplete="none" />
                    </div>
                </div>

                <br />

                <button type="submit">New Message</button>
                <br />
            </form>

            <h2>Messages</h2>
            <div style={{ display: 'flex', flexDirection: 'column', borderColor: '#2196F3', borderLeft: '6px solid #ccc', backgroundColor: '#ddffff', gap: '10px', padding: '10px' }}>
                {
                    Object.entries(messages).map(([key, value]) => (
                        <div style={{ backgroundColor: 'lavenderblush', }}>
                            <div>{value.message_id}</div>
                            <div>{value.message}</div>
                            <div>{value.updated_at}</div>
                        </div>
                    ))
                }

            </div>

        </>
    )

}