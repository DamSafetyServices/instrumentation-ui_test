import React from "react";

export default () => {
  return (
    <footer className="footer mt-auto py-3">
      <div className="text-center">
        <p>
          <strong>
            <i className="mdi mdi-copyright"></i>
          </strong>{" "}
          U.S. Army Corps of Engineers {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};
