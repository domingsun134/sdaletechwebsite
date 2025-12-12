import ReactGA from "react-ga4";

// Initialize GA4 - Replace with your Measurement ID
const MEASUREMENT_ID = "G-XXXXXXXXXX"; // Placeholder

export const initGA = () => {
    ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
};

export const logEvent = (category, action, label) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label,
    });
};
