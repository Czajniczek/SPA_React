using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public DateTime OrderDate { get; set; }

        public int Count { get; set; }

        public int ClientId { get; set; }

        public virtual Client Client { get; set; }

        public int BookId { get; set; }

        public virtual Book Book { get; set; }
    }
}
