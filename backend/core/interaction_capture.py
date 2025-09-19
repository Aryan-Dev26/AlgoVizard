"""
User Interaction Capture System
Adapted from NetworkCapture for algorithm visualization
Author: Aryan Pravin Sahu
"""

import json
import os
from datetime import datetime
import uuid

class UserInteractionCapture:
    """
    Captures user interactions with algorithm visualizer
    Adapted from network packet capture concept
    """
    
    def __init__(self):
        self.session_id = str(uuid.uuid4())[:8]
        self.interactions = []
        self.session_start = datetime.now()
        
    def capture_interaction(self, algorithm, action, data=None):
        """Capture user interaction event"""
        interaction = {
            'timestamp': datetime.now().isoformat(),
            'session_id': self.session_id,
            'algorithm': algorithm,
            'action': action,  # 'view', 'start', 'pause', 'reset'
            'data': data
        }
        self.interactions.append(interaction)
        
    def save_session_data(self):
        """Save interaction data to JSON file"""
        # Create data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)
        
        session_data = {
            'session_id': self.session_id,
            'session_start': self.session_start.isoformat(),
            'session_end': datetime.now().isoformat(),
            'total_interactions': len(self.interactions),
            'interactions': self.interactions
        }
        
        # Save to file
        filename = f"data/session_{self.session_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(session_data, f, indent=2)
            
        return filename

# Global instance for this session
interaction_tracker = UserInteractionCapture()