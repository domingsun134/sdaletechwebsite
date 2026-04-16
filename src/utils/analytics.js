import ReactGA from "react-ga4";
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Initialize GA4 - Replace with your Measurement ID
const MEASUREMENT_ID = "G-XXXXXXXXXX"; // Placeholder

export const initGA = () => {
    ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = async () => {
    const path = window.location.pathname + window.location.search;

    // GA4 Logging
    ReactGA.send({ hitType: "pageview", page: path });

    // Supabase Analytics Logging
    try {
        let sessionId = localStorage.getItem('st_analytics_session_id');
        if (!sessionId) {
            sessionId = uuidv4();
            localStorage.setItem('st_analytics_session_id', sessionId);
        }

        // Determine simple device type
        const ua = navigator.userAgent;
        let deviceType = 'Desktop';
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            deviceType = 'Tablet';
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            deviceType = 'Mobile';
        }

        const { error } = await supabase.from('page_views').insert([{
            path: path,
            user_agent: ua,
            device_type: deviceType,
            session_id: sessionId
        }]);

        if (error) {
            console.error('Supabase analytics insert error:', error.message);
        }

    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
};

export const logEvent = (category, action, label) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label,
    });
};
