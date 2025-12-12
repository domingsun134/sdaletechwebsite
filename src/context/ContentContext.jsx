import React, { createContext, useState, useContext, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    // Default content for the Home page
    const defaultContent = {
        home: {
            hero: {
                title: "Moulding Our World Precisely",
                subtitle: ""
            },
            about: {
                title: "A one-stop precision Plastic Engineering Company",
                description: "Sunningdale Tech Ltd is a leading manufacturer of precision plastic components. The Group provides one-stop, turnkey plastic solutions, with capabilities ranging from product & mould designs, mould fabrication, injection moulding, complementary ﬁnishings, through to the precision assembly of complete products."
            },
            globalFootprint: {
                title: "Global Footprint",
                description: "With manufacturing facilities across Asia, South America, and Europe, we are positioned to serve our customers wherever they are.",
                stats: [
                    { label: "Manufacturing Sites", value: "18+" },
                    { label: "Countries", value: "9" }
                ]
            }
        }
    };

    // Load content from localStorage or use default
    const [content, setContent] = useState(() => {
        const savedContent = localStorage.getItem('siteContent');
        return savedContent ? JSON.parse(savedContent) : defaultContent;
    });

    // Save content to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('siteContent', JSON.stringify(content));
    }, [content]);

    const updateContent = (section, key, value) => {
        setContent(prevContent => ({
            ...prevContent,
            [section]: {
                ...prevContent[section],
                [key]: value
            }
        }));
    };

    const updateNestedContent = (section, subSection, key, value) => {
        setContent(prevContent => ({
            ...prevContent,
            [section]: {
                ...prevContent[section],
                [subSection]: {
                    ...prevContent[section][subSection],
                    [key]: value
                }
            }
        }));
    };

    return (
        <ContentContext.Provider value={{ content, updateContent, updateNestedContent }}>
            {children}
        </ContentContext.Provider>
    );
};
