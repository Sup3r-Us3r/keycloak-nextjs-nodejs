import { useSession } from 'next-auth/react';
import type { AxiosInstance } from 'axios';

import { setupAPIClient } from '../services/api';

function useAPIClient(): AxiosInstance {
  const session = useSession();

  return setupAPIClient(session.data);
}

export { useAPIClient };
