using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class Book
    {
        public int BookId { get; set; }

        public string Title { get; set; }

        public decimal Cost { get; set; }

        public int PageCount { get; set; }

        public DateTime PublicationDate { get; set; }

        public string Author { get; set; }

        public string Publisher { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
