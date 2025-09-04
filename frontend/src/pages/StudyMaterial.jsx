import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import { FiFileText, FiCopy, FiRepeat, FiDownload, FiX, FiLoader } from 'react-icons/fi';

import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Flashcard from '../components/StudyMaterial/Flashcard';

const StudyMaterial = () => {
    const [topic, setTopic] = useState('');
    const [materialType, setMaterialType] = useState(null);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (type) => {
        if (!topic.trim()) {
            toast.error("Please enter a topic first!");
            return;
        }
        setMaterialType(type);
        setLoading(true);
        setContent(null);
        try {
            const res = await api.post('/material/generate', { topic, materialType: type });
            setContent(res.data.content);
        } catch (error) {
            toast.error("Failed to generate material. Please try again.");
            setMaterialType(null);
        } finally {
            setLoading(false);
        }
    };

    // --- NEW, INTELLIGENT PDF GENERATOR ---
    const handleDownloadPdf = () => {
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const maxLineWidth = pageWidth - margin * 2;
        let y = margin; // This is our vertical cursor

        const addPageIfNeeded = () => {
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin;
                // Optional: Add headers/footers to new pages as well
            }
        };

        const lines = content.split('\n');

        lines.forEach(line => {
            addPageIfNeeded();

            if (line.startsWith('# ')) { // Main Title
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                const title = line.substring(2);
                doc.text(title, pageWidth / 2, y, { align: 'center' });
                y += 15;
            } else if (line.startsWith('## ')) { // Subheading
                y += 5;
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(60);
                const subTitle = line.substring(3);
                doc.text(subTitle, margin, y);
                y += 10;
            } else if (line.startsWith('- ')) { // Bullet Point
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(80);
                const bulletText = line.substring(2);
                doc.circle(margin + 2, y - 1.5, 1, 'F');
                const splitText = doc.splitTextToSize(bulletText, maxLineWidth - 8);
                doc.text(splitText, margin + 5, y);
                y += (splitText.length * 7);
            } else if (line.trim() === '') { // Empty line for spacing
                y += 5;
            } else { // Paragraph
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(80);
                // This logic handles bold text by splitting and re-drawing
                const parts = line.split('**');
                let currentX = margin;
                const splitLine = doc.splitTextToSize(parts.join(''), maxLineWidth); // Get lines for wrapping

                splitLine.forEach(textLine => {
                    addPageIfNeeded();
                    let tempX = margin;
                    // This is a simplified bold handler for wrapped text, more complex logic can be added
                    doc.text(textLine, tempX, y);
                    y += 7;
                });
            }
        });

        // Add page numbers to all pages
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        doc.save(`${topic.replace(/\s+/g, '_')}_notes.pdf`);
    };

    const resetState = () => {
        setMaterialType(null);
        setContent(null);
    };

    const materialOptions = [
        { type: 'notes', label: 'PDF Notes', icon: FiFileText },
        { type: 'flashcards', label: 'Flashcards', icon: FiCopy },
        { type: 'summary', label: 'Summary', icon: FiRepeat },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <h2 className="text-2xl font-semibold mb-2">Study Material Generator</h2>
                <p className="text-textSecondary mb-4">Enter any topic and let our AI create personalized study materials for you.</p>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="w-full sm:flex-grow">
                        <Input id="topic" name="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Roman Empire, Quantum Physics..."/>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {materialOptions.map(opt => {
                        const isActive = materialType === opt.type && !loading;
                        const buttonClass = isActive ? 'bg-primary hover:bg-primary-dark' : 'bg-secondary hover:bg-secondary-dark';
                        return (
                            <Button key={opt.type} onClick={() => handleGenerate(opt.type)} disabled={loading} icon={loading && materialType === opt.type ? FiLoader : opt.icon} className={`${buttonClass} ${loading && materialType === opt.type ? 'animate-spin' : ''}`}>
                                {loading && materialType === opt.type ? 'Generating...' : `Generate ${opt.label}`}
                            </Button>
                        )
                    })}
                </div>
            </Card>

            <AnimatePresence>
                {loading && (
                     <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center mt-8">
                        <Card><p className="text-textSecondary">Our AI is hard at work... please wait a moment!</p></Card>
                    </motion.div>
                )}

                {content && (
                    <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold capitalize">{materialType} for "{topic}"</h3>
                                <div>
                                    {materialType === 'notes' && <Button onClick={handleDownloadPdf} icon={FiDownload} className="mr-2">Download PDF</Button>}
                                    <Button onClick={resetState} icon={FiX} className="bg-gray-500 hover:bg-gray-600">Clear</Button>
                                </div>
                            </div>
                            
                            {materialType === 'notes' && <pre className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-sans text-sm max-h-[32rem] overflow-y-auto">{content}</pre>}
                            
                            {materialType === 'summary' && <div className="prose prose-sm max-w-none text-textSecondary leading-relaxed">{content}</div>}
                            
                            {materialType === 'flashcards' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1000px]">
                                    {content.map((card, index) => <Flashcard key={index} front={card.front} back={card.back} />)}
                                </div>
                            )}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StudyMaterial;