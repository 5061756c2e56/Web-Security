export interface EntropyAnalysis {
    entropy: number;
    strength: 'Très faible' | 'Faible' | 'Moyen' | 'Fort' | 'Très fort';
    estimatedTime: string;
    patterns: string[];
    suggestions: string[];
}

export function analyzeEntropy(password: string): EntropyAnalysis {
    let charsetSize = 0;
    const patterns: string[] = [];
    const suggestions: string[] = [];

    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

    if (charsetSize === 0) {
        return {
            entropy: 0,
            strength: 'Très faible',
            estimatedTime: 'Instantané',
            patterns: ['Aucun caractère valide'],
            suggestions: ['Ajoutez des caractères']
        };
    }

    const entropy = password.length * Math.log2(charsetSize);

    if (/(.)\1{2,}/.test(password)) {
        patterns.push('Répétitions de caractères');
        suggestions.push('Évitez les répétitions');
    }

    if (/123|abc|ABC|qwerty|password/i.test(password)) {
        patterns.push('Séquences communes');
        suggestions.push('Évitez les séquences prévisibles');
    }

    if (password.length < 8) {
        patterns.push('Trop court');
        suggestions.push('Utilisez au moins 12 caractères');
    }

    if (!/[A-Z]/.test(password)) {
        suggestions.push('Ajoutez des majuscules');
    }

    if (!/[0-9]/.test(password)) {
        suggestions.push('Ajoutez des chiffres');
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        suggestions.push('Ajoutez des caractères spéciaux');
    }

    let strength: EntropyAnalysis['strength'];
    let estimatedTime: string;

    if (entropy < 28) {
        strength = 'Très faible';
        estimatedTime = 'Quelques secondes';
    } else if (entropy < 36) {
        strength = 'Faible';
        estimatedTime = 'Quelques minutes';
    } else if (entropy < 60) {
        strength = 'Moyen';
        estimatedTime = 'Quelques heures à jours';
    } else if (entropy < 80) {
        strength = 'Fort';
        estimatedTime = 'Années';
    } else {
        strength = 'Très fort';
        estimatedTime = 'Millénaires';
    }

    return {
        entropy: Math.round(entropy * 100) / 100,
        strength,
        estimatedTime,
        patterns: patterns.length > 0 ? patterns : ['Aucun pattern détecté'],
        suggestions: suggestions.length > 0 ? suggestions : ['Mot de passe solide']
    };
}
