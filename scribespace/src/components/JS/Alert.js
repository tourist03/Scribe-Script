import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import '../CSS/Alert.css';

const Alert = (props) => {
  if (!props.alert) return null;

  const getIcon = () => {
    switch (props.alert.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="alert-wrapper">
      <div className={`alert alert-${props.alert.type}`}>
        {getIcon()}
        <span>{props.alert.msg}</span>
      </div>
    </div>
  );
};

export default Alert;