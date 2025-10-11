// API module for data fetching
const API_BASE = './data/exams.json';

export class ExamAPI {
    static async fetchExams() {
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching exams:', error);
            throw error;
        }
    }

    static async getExamsByType(type) {
        try {
            const data = await this.fetchExams();
            if (type === 'all') {
                return data.exams;
            }
            return data.exams.filter(exam => exam.type === type);
        } catch (error) {
            console.error('Error filtering exams:', error);
            return [];
        }
    }

    static async getExamsBySubject(subject) {
        try {
            const data = await this.fetchExams();
            if (subject === 'all') {
                return data.exams;
            }
            return data.exams.filter(exam => exam.subject === subject);
        } catch (error) {
            console.error('Error filtering by subject:', error);
            return [];
        }
    }

    static async searchExams(query) {
        try {
            const data = await this.fetchExams();
            const searchTerm = query.toLowerCase();
            return data.exams.filter(exam => 
                exam.name.toLowerCase().includes(searchTerm) ||
                exam.subject.toLowerCase().includes(searchTerm) ||
                exam.description.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching exams:', error);
            return [];
        }
    }

    static async getFeaturedExams(limit = 6) {
        try {
            const data = await this.fetchExams();
            return data.exams
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting featured exams:', error);
            return [];
        }
    }

    static async getRecommendedExams(userPreferences) {
        try {
            const data = await this.fetchExams();
            // Simple recommendation algorithm based on user preferences
            return data.exams
                .filter(exam => {
                    if (userPreferences.targetExam && userPreferences.targetExam !== 'all') {
                        return exam.type === userPreferences.targetExam;
                    }
                    return true;
                })
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 4);
        } catch (error) {
            console.error('Error getting recommended exams:', error);
            return [];
        }
    }
}