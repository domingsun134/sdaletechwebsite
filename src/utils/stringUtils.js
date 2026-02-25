/**
 * Calculates the Levenshtein distance between two strings.
 * This measures the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one word into the other.
 * 
 * @param {string} a 
 * @param {string} b 
 * @returns {number} The distance
 */
export const levenshteinDistance = (a, b) => {
    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

/**
 * Determines if two strings are a fuzzy match based on token overlap and Levenshtein distance.
 * 
 * @param {string} str1 First string (e.g., User's company)
 * @param {string} str2 Second string (e.g., Job's company)
 * @param {number} threshold Distance threshold (default 3)
 * @returns {boolean} True if they match
 */
export const isFuzzyMatch = (str1, str2, threshold = 3) => {
    if (!str1 || !str2) return false;

    // Normalize: lowercase and remove special chars
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    // Remove common prefixes like "1000 - "
    const stripPrefix = (s) => s.replace(/^\d+\s*-\s*/, '');

    const s1 = normalize(stripPrefix(str1));
    const s2 = normalize(stripPrefix(str2));

    // 1. Direct match (normalized)
    if (s1 === s2) return true;
    if (s1.includes(s2) || s2.includes(s1)) return true;

    // 2. Token-based matching (e.g. "Sunningdale Tech" vs "Sunningdale Tech Ltd")
    // If all significant tokens of the shorter string are present in the longer one
    const tokens1 = s1.split(/\s+/).filter(t => t.length > 2); // Ignore short words like "co", "pt"
    const tokens2 = s2.split(/\s+/).filter(t => t.length > 2);

    const longer = tokens1.length >= tokens2.length ? tokens1 : tokens2;
    const shorter = tokens1.length < tokens2.length ? tokens1 : tokens2;

    // Check if substantial number of tokens match
    const matchingTokens = shorter.filter(t1 =>
        longer.some(t2 => {
            // Exact token match or very close fuzzy match
            if (t1 === t2) return true;
            return levenshteinDistance(t1, t2) <= 1; // Allow 1 typo per token
        })
    );

    // If more than 75% of the shorter string's tokens match, consider it a match
    if (shorter.length > 0 && (matchingTokens.length / shorter.length) >= 0.75) {
        return true;
    }

    // 3. Overall Levenshtein distance for the whole string (allow more typos for longer strings)
    const dist = levenshteinDistance(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);

    // Allow ~20% difference
    if (dist <= maxLen * 0.2) return true;

    return false;
};
