import type { FC } from "hono/jsx";

type LayoutProps = {
  title?: string;
  children: any;
};

export const Layout: FC<LayoutProps> = ({ title = "Deno Backend", children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>
          {`
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #333;
            }
            .container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              padding: 3rem;
              max-width: 600px;
              width: 90%;
            }
            h1 {
              color: #667eea;
              margin-bottom: 1rem;
              font-size: 2.5rem;
            }
            p {
              color: #666;
              line-height: 1.6;
              margin-bottom: 1rem;
            }
            .badge {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.875rem;
              font-weight: 600;
              margin-right: 0.5rem;
            }
            .endpoints {
              background: #f7fafc;
              border-radius: 8px;
              padding: 1.5rem;
              margin-top: 2rem;
            }
            .endpoints h2 {
              color: #4a5568;
              font-size: 1.25rem;
              margin-bottom: 1rem;
            }
            .endpoint {
              display: flex;
              align-items: center;
              margin-bottom: 0.75rem;
              font-family: 'Monaco', 'Courier New', monospace;
              font-size: 0.875rem;
            }
            .method {
              font-weight: bold;
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              margin-right: 0.75rem;
              width: 60px;
              text-align: center;
            }
            .method.post { background: #48bb78; color: white; }
            .method.get { background: #4299e1; color: white; }
            .method.patch { background: #ed8936; color: white; }
            .method.delete { background: #f56565; color: white; }
            .path {
              color: #2d3748;
            }
            .footer {
              margin-top: 2rem;
              padding-top: 1.5rem;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #a0aec0;
              font-size: 0.875rem;
            }
          `}
        </style>
      </head>
      <body>
        <div class="container">
          {children}
        </div>
      </body>
    </html>
  );
};
