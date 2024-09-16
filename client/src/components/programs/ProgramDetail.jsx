import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProgramById } from '../../services/programService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const ProgramDetail = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const getProgram = async () => {
      try {
        const data = await fetchProgramById(id);
        setProgram(data);
      } catch (error) {
        toast.error('Failed to fetch program details');
      }
    };
    getProgram();
  }, [id]);

  if (!program) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">{program.name}</h2>
      <p><strong>Description:</strong> {program.description}</p>
      <p><strong>Duration:</strong> {program.duration}</p>
      <p><strong>Start Date:</strong> {new Date(program.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(program.endDate).toLocaleDateString()}</p>
      <p><strong>Cost:</strong> ${program.cost}</p>
      <p><strong>Age Group:</strong> {program.ageGroup}</p>
      <p><strong>Class Size:</strong> {program.classSize}</p>
      <p><strong>Location:</strong> {program.location}</p> {/* New location field */}
    </div>
  );
};

export default ProgramDetail;
