import React, { useState } from 'react';

function OfferBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', marginLeft: '16px', marginRight: '16px',
      background: 'linear-gradient(135deg, rgb(11,92,46) 0%, rgb(32,192,92) 60%, rgb(11,92,46) 100%)',
      border: '1px solid rgba(32,192,92,0.5)',
      boxShadow: 'rgba(32,192,92,0.25) 0px 0px 24px'
    }}>
      {/* decorative circles */}
      <div style={{position:'absolute',top:'-24px',right:'-24px',width:'96px',height:'96px',borderRadius:'50%',background:'rgb(255,255,255)',opacity:0.2}} />
      <div style={{position:'absolute',bottom:'-16px',left:'-16px',width:'64px',height:'64px',borderRadius:'50%',background:'rgb(255,255,255)',opacity:0.1}} />

      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          {/* % badge */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRadius:'12px',padding:'6px 12px',background:'rgba(0,0,0,0.25)',minWidth:'54px'}}>
            <span style={{color:'#fff',fontSize:'22px',fontWeight:900,lineHeight:1}}>25%</span>
            <span style={{color:'rgba(255,255,255,0.85)',fontSize:'8px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>OFF</span>
          </div>
          {/* text */}
          <div>
            <p style={{color:'#fff',fontSize:'13px',fontWeight:900,lineHeight:1.2,margin:0}}>New User Offer!</p>
            <p style={{color:'rgba(255,255,255,0.9)',fontSize:'11px',fontWeight:500,lineHeight:1.4,margin:0}}>
              Get 25% off on your <span style={{fontWeight:700,color:'#fff'}}>second booking!</span>
            </p>
          </div>
        </div>

        {/* close button */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss offer"
          style={{width:'24px',height:'24px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',background:'rgba(0,0,0,0.25)',border:'none',cursor:'pointer',flexShrink:0,marginLeft:'8px'}}
        >
          <svg role="img" aria-label="Close" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <title>Close</title>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default OfferBanner;