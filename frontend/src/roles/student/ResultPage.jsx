import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getStudentResult } from "../../api/marksApi";
import Result from "../../components/Result";
import useAuth from "../../auth/context/useAuth";
import html2pdf from 'html2pdf.js';

const ResultPage = () => {
    const { studentId } = useParams();
    const location = useLocation();
    const { user } = useAuth();
    const [result, setResult] = useState(location.state?.result || null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!result) {
            const fetchResult = async () => {
                try {
                    const data = await getStudentResult(studentId, user.token);
                    setResult(data);
                } catch (err) {
                    setError("Error fetching result: " + err.message);
                }
            };
            fetchResult();
        }
    }, [studentId, result, user.token]);

    const downloadPDF = () => {
        const element = document.getElementById('result-container');

        const options = {
            margin: 1,
            filename: 'result.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(options).save();
    };

    return (
        <div className="container-fluid d-flex flex-column vh-100">
            {/* Combined Content Area */}
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start p-3">
                <div className="w-100 d-flex justify-content-end align-items-center mb-1">
                    <button className="btn btn-primary" onClick={downloadPDF}>
                        Download Result
                    </button>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {result ? (
                    <div id="result-container" className="w-100" style={{ maxWidth: '600px' }}>
                        <Result result={result} />
                    </div>
                ) : !error && <p className="h5">Loading...</p>}
            </div>
        </div>
    );
};

export default ResultPage;
