import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmailBuilder = () => {
    // Raw HTML from server (our layout)
    const [layout, setLayout] = useState('');

    // Editable fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [footer, setFooter] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // List of all saved configs from the database
    const [allConfigs, setAllConfigs] = useState([]);

    // 1. Fetch the base layout on component mount
    useEffect(() => {
        axios.get('https://rapidquest-hqhw.onrender.com/api/getEmailLayout')
            .then((res) => {
                console.log('Fetched layout:', res.data.layout); // <--- Add this
                setLayout(res.data.layout);
            })
            .catch((err) => console.error('Failed to fetch layout', err));
    }, []);



    // 2. Fetch all saved configs on component mount
    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const res = await axios.get('https://rapidquest-hqhw.onrender.com/api/getAllConfigs');
                setAllConfigs(res.data.configs);  // store them in state
            } catch (error) {
                console.error('Failed to fetch configs', error);
            }
        };
        fetchConfigs();
    }, []);

    // 3. Handle image upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('https://rapidquest-hqhw.onrender.com/api/uploadImage', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImageUrl(res.data.imageUrl);
        } catch (error) {
            console.error('Image upload failed', error);
        }
    };

    // 4. Save the config to MongoDB
    const handleSaveConfig = async () => {
        const config = { title, content, footer, imageUrl };

        try {
            const response = await axios.post('https://rapidquest-hqhw.onrender.com/api/saveEmailConfig', config);
            alert('Config saved to DB! ID: ' + response.data.emailConfig._id);

            // Optionally re-fetch configs after saving to update the list in real time
            const refreshed = await axios.get('https://rapidquest-hqhw.onrender.com/api/getAllConfigs');
            setAllConfigs(refreshed.data.configs);

        } catch (error) {
            console.error('Save config error:', error);
            alert('Failed to save config to DB.');
        }
    };

    // 5. Generate live preview by replacing placeholders
    const getPreviewHTML = () => {
        let preview = layout.replace('{{title}}', title || '');
        preview = preview.replace('{{content}}', content || '');
        preview = preview.replace('{{footer}}', footer || '');
        preview = preview.replace('{{imageUrl}}', imageUrl || '');
        //

        return preview;
    };

    // 6. Download final HTML from backend
    const handleDownloadTemplate = async () => {
        const config = { title, content, footer, imageUrl };

        try {
            const response = await axios.post('https://rapidquest-hqhw.onrender.com/api/renderTemplate', config, {
                responseType: 'blob', // important for file downloads
            });
            // Create a downloadable link
            const file = new Blob([response.data], { type: 'text/html' });
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'generated-email.html');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading template', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Email Builder</h1>

            {/* Form to edit placeholders */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block font-semibold">Title:</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-semibold">Content:</label>
                    <textarea
                        className="border rounded w-full p-2"
                        rows="4"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-semibold">Footer:</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={footer}
                        onChange={(e) => setFooter(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Image:</label>
                    <input
                        type="file"
                        className="block border  rounded-lg p-2 text-gray-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        onChange={handleImageUpload}
                    />

                    {/* Preview the uploaded image */}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="mt-4 max-h-48 rounded-md shadow-sm border border-gray-300"
                        />
                    )}
                </div>

                {/* Buttons for saving and downloading */}
                <div>
                    {/* <button
                        className="bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={handleSaveConfig}
                    >
                        Save Config
                    </button> */}
                    <button
                        className="bg-green-600 text-white py-2 px-4 rounded ml-2"
                        onClick={handleDownloadTemplate}
                    >
                        Download HTML
                    </button>
                </div>
            </div>

            {/* Live Preview */}
            <h2 className="text-xl font-bold mb-2">Live Preview</h2>
            <div
                className="border p-4 mb-8"
                dangerouslySetInnerHTML={{ __html: getPreviewHTML() }}
            />

            {/* Display all saved configs */}
            {/* <h2 className="text-xl font-bold mb-2">Saved Email Configurations</h2>
            <ul className="list-disc ml-6">
                {allConfigs.map((cfg) => (
                    <li key={cfg._id} className="mb-1">
                        <strong>Title:</strong> {cfg.title} |{" "}
                        <strong>Created:</strong>{" "}
                        {new Date(cfg.createdAt).toLocaleString()}
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default EmailBuilder;
