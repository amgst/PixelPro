import { Wrench, Code, Palette, Zap, Globe, Database } from 'lucide-react';

export interface Tool {
    id: string;
    name: string;
    description: string;
    url: string;
    iconName: string; // Storing icon name as string to save in LocalStorage
    category: 'Development' | 'Design' | 'Productivity' | 'Other';
}

export const TOOLS_SEED_DATA: Tool[] = [
    {
        id: '1',
        name: 'JSON Formatter',
        description: 'Format and validate JSON data.',
        url: 'https://jsonformatter.org/',
        iconName: 'Code',
        category: 'Development'
    },
    {
        id: '2',
        name: 'Color Picker',
        description: 'Get hex codes and RGB values.',
        url: 'https://htmlcolorcodes.com/',
        iconName: 'Palette',
        category: 'Design'
    },
    {
        id: '3',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for your designs.',
        url: 'https://loremipsum.io/',
        iconName: 'Zap',
        category: 'Productivity'
    }
];

// Helper to get Icon component by name
export const getIconByName = (name: string) => {
    const icons: { [key: string]: any } = {
        Wrench, Code, Palette, Zap, Globe, Database
    };
    return icons[name] || Wrench;
};
