import React from 'react'

const Features = () => {
  return (
    <section className="features">
            <div>
                <div>
                    <h1 className='h1'>Features</h1>
                </div>
                <div className="boxes">
                    <div className="box">
                        <div><img src="src/images/Decentralised.jpg" alt="" /></div>
                      <div className="box-desc">
                      <h2 className="h2">Decentralised & Secure Voting</h2>
                      <p>Blockchain-backed security prevents vote tampering.</p>
                      </div>
                     </div>
                    <div className="box">
                        <div><img src="src/images/audit.jpg" alt="" /></div>
                        <div className="box-desc">
                            <h2 className="h2">Transparency & Auditability</h2>
                            <p>Immutable ledger allows audits without compromising privacy.</p>
                        </div>
                    </div>
                    <div className="box">
                        <div><img src="src/images/realtime.png" alt="" /></div>
                        <div className="box-desc">
                            <h2 className="h2">Real-Time Results</h2>
                            <p>Immediate vote tallies ensure instant transparency.</p>
                        </div>
                        </div>
                        <div className="box">
                            <div><img src="src/images/verification.jpg" alt="" /></div>
                            <div className="box-desc">
                                <h2 className="h2">Voter Verification</h2>
                                <p>Multi-factor authentication secures voter access.</p>
                            </div>
                        </div>
                        <div className="box">
                            <div><img src="src/images/privacy.jpg" alt="" /></div>
                            <div className="box-desc">
                                <h2 className="h2">Privacy Protection</h2>
                                <p>Cryptographic measures ensure anonymous voting.</p>
                            </div>
                        </div>
                        <div className="box">
                            <div><img src="src/images/scalable.jpg" alt="" /></div>
                            <div className="box-desc">
                                <h2 className="h2">Scalable System</h2>
                                <p>Adapts to local, national, or global elections.</p>
                            </div>
                        </div>
                        
                    </div>
            </div>
    </section>
  )
}

export default Features